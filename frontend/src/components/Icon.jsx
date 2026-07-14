const symbols = {
  arrow: "→",
  bag: "▢",
  check: "✓",
  close: "×",
  heart: "♡",
  menu: "☰",
  search: "⌕",
  shield: "◆",
  store: "▥",
  user: "●",
};

function Icon({ name, filled = false }) {
  const symbol = filled && name === "heart" ? "♥" : symbols[name];
  return <span className={`ui-icon ui-icon-${name}`} aria-hidden="true">{symbol}</span>;
}

export default Icon;
