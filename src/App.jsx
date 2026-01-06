import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:4000/recipes";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error("API unavailable");
        }
        const data = await res.json();
        setRecipes(data);
        setSelectedId(data[0]?.id ?? null);
        setError("");
      } catch (err) {
        setError(err.message || "Unable to fetch recipes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return recipes;
    return recipes.filter((recipe) => {
      const haystack = [
        recipe.title,
        recipe.cuisine,
        recipe.tags?.join(" "),
        recipe.ingredients?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [recipes, search]);

  const selected = filtered.find((r) => r.id === selectedId) || filtered[0];

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleAddRecipe = async (formData) => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        ingredients: formData.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Unable to add recipe");
      }

      const created = await res.json();
      setRecipes((prev) => [...prev, created]);
      setSelectedId(created.id);
      setError("");
      return true;
    } catch (err) {
      setError(err.message || "Unable to add recipe");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <nav className="nav">
        <div className="brand">Pantry Pages</div>
        <span className="badge">Local API • json-server</span>
      </nav>

      <header className="hero">
        <h1>Cookbook workspace</h1>
        <p>
          Search, preview, and expand your recipe collection. Data is served
          from json-server so you can test fetch, post, and search flows
          quickly.
        </p>
        <small>API: {API_URL}</small>
      </header>

      <div className="grid">
        <section className="panel stack">
          <div className="search-bar">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, cuisine, or ingredients"
              aria-label="Search recipes"
            />
          </div>

          {loading && <p className="status">Loading recipes…</p>}
          {error && !loading && <p className="status">{error}</p>}

          {!loading && !filtered.length && (
            <p className="status">No recipes found. Try clearing search.</p>
          )}

          <div className="recipes-grid">
            {filtered.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={handleSelect}
                active={recipe.id === selected?.id}
              />
            ))}
          </div>
        </section>

        <section className="panel stack">
          <div className="detail">
            <h2>Recipe detail</h2>
            {selected ? (
              <RecipeDetail recipe={selected} />
            ) : (
              <p className="status">Select a recipe to view details.</p>
            )}
          </div>

          <div className="form">
            <h2>Add a recipe</h2>
            <AddRecipeForm onSubmit={handleAddRecipe} saving={saving} />
          </div>
        </section>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onSelect, active }) {
  return (
    <article className="card">
      <div className="meta">
        <span>{recipe.time}</span>
        <span>{recipe.difficulty}</span>
        <span>{recipe.servings} servings</span>
      </div>
      <h3>{recipe.title}</h3>
      <div className="meta">{recipe.cuisine}</div>
      {recipe.tags?.length ? (
        <div className="tags">
          {recipe.tags.map((tag) => (
            <span className="pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <button type="button" onClick={() => onSelect(recipe.id)}>
        {active ? "Viewing" : "View details"}
      </button>
    </article>
  );
}

function RecipeDetail({ recipe }) {
  return (
    <div className="detail">
      <div className="meta">
        <span>{recipe.time}</span>
        <span>{recipe.difficulty}</span>
        <span>{recipe.servings} servings</span>
      </div>
      <h3>{recipe.title}</h3>
      <div className="tags">
        {recipe.tags?.map((tag) => (
          <span className="pill" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <h4>Ingredients</h4>
      <ul className="detail-list">
        {recipe.ingredients?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h4>Instructions</h4>
      <p>{recipe.instructions}</p>
    </div>
  );
}

function AddRecipeForm({ onSubmit, saving }) {
  const [form, setForm] = useState({
    title: "",
    cuisine: "",
    time: "",
    difficulty: "",
    servings: "",
    tags: "",
    ingredients: "",
    instructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(form);
    if (success) {
      setForm({
        title: "",
        cuisine: "",
        time: "",
        difficulty: "",
        servings: "",
        tags: "",
        ingredients: "",
        instructions: "",
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Smoky tofu tacos"
          required
        />
      </label>
      <label>
        Cuisine
        <input
          name="cuisine"
          value={form.cuisine}
          onChange={handleChange}
          placeholder="Fusion"
        />
      </label>
      <label>
        Time
        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="25 min"
        />
      </label>
      <label>
        Difficulty
        <input
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          placeholder="Easy"
        />
      </label>
      <label>
        Servings
        <input
          name="servings"
          value={form.servings}
          onChange={handleChange}
          placeholder="4"
          inputMode="numeric"
        />
      </label>
      <label>
        Tags (comma separated)
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="vegan, weeknight"
        />
      </label>
      <label>
        Ingredients (comma separated)
        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          placeholder="corn tortillas, chipotle, tofu, lime"
          required
        />
      </label>
      <label>
        Instructions
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          placeholder="Marinate tofu, sear, warm tortillas, assemble."
          required
        />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Add recipe"}
      </button>
    </form>
  );
}

export default App;
