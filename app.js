import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import session from "express-session";
import connectPgSimple from 'connect-pg-simple';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* -------------------- DATABASE -------------------- */
const pool = new pg.Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
});

/* -------------------- SESSION -------------------- */

// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);

app.use(
  session({
    store: new pgSession({
      pool: new pg.Pool({
        connectionString: process.env.DATABASE_URL,
      }),
      tableName: 'session', // optional, default is 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);


/* -------------------- APP STATE -------------------- */
let currentUserId = 1;
let users = [];

/* -------------------- HELPERS -------------------- */
function requireLogin(req, res, next) {
  if (!req.session.isAuthenticated) return res.redirect("/login");
  next();
}

/**
 * Returns list of visited country codes for a given user.
 * Accepts optional userId and pool for testing purposes.
 */
async function checkVisited(userId = currentUserId, dbPool = pool) {
  const result = await dbPool.query(
    `SELECT country_code FROM visited_countries WHERE user_id = $1`,
    [userId]
  );
  return result.rows.map(row => row.country_code);
}

/**
 * Returns current user object.
 * Accepts optional userId and pool for testing purposes.
 */
async function getCurrentUser(userId = currentUserId, dbPool = pool) {
  const result = await dbPool.query("SELECT * FROM users");
  users = result.rows;
  return users.find(user => user.id === Number(userId));
}

/* -------------------- ROUTES -------------------- */
/* LOGIN */
app.get("/login", (req, res) => {
  res.render("login.ejs", { error: null });
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.APP_USERNAME &&
    password === process.env.APP_PASSWORD
  ) {
    req.session.isAuthenticated = true;
    return res.redirect("/");
  }

  res.render("login.ejs", { error: "Invalid credentials" });
});

/* LOGOUT */
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/* HOME */
app.get("/", requireLogin, async (req, res) => {
  try {
    const countries = await checkVisited();
    const currentUser = await getCurrentUser();

    res.render("index.ejs", {
      countries,
      total: countries.length,
      users,
      color: currentUser?.color || "teal",
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/* ADD COUNTRY */
app.post("/add", requireLogin, async (req, res) => {
  const input = req.body.country?.toLowerCase();
  try {
    const result = await pool.query(
      `SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'`,
      [input]
    );

    if (!result.rows.length) {
      const countries = await checkVisited();
      const currentUser = await getCurrentUser();
      return res.render("index.ejs", {
        countries,
        total: countries.length,
        users,
        color: currentUser?.color || "teal",
        error: "Country not found!"
      });
    }

    await pool.query(
      `INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)`,
      [result.rows[0].country_code, currentUserId]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

/* SWITCH USER */
app.post("/user", requireLogin, (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs", { error: null });
  } else {
    currentUserId = Number(req.body.user);
    res.redirect("/");
  }
});

/* CREATE NEW USER */
app.post("/new", requireLogin, async (req, res) => {
  const { name, color } = req.body;

  if (!name || !color) {
    return res.render("new.ejs", { error: "Name and color are required" });
  }

  const result = await pool.query(
    `INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id`,
    [name, color]
  );

  currentUserId = result.rows[0].id;
  res.redirect("/");
});

/* -------------------- EXPORTS -------------------- */
export { checkVisited, getCurrentUser };
export default app;


