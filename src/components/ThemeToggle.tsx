import { useEffect, useState } from "react";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    // Save theme to local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  return (
    <div className="flex items-center gap-2">
    <label htmlFor="theme-select" className="font-medium">Select Theme:</label>
    <select
      id="theme-select"
      value={theme}
      onChange={handleChange}
      className="select select-bordered select-primary"
    >
      <option value="light">Light Mode</option>
      <option value="dark">Dark Mode</option>
    </select>
  </div>
  );
};

export default ThemeToggle;
