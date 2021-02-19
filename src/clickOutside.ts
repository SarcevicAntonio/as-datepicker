/** Dispatch event on click outside of node */
export function clickOutside(node) {
  const handleClick = (event) => {
    // use event.path[0] instead of event.target for webcomponent compat because of shadowdom!
    // but also since firefox doesnt have path we have to call .composedPath() to get path
    var path = event.path || (event.composedPath && event.composedPath());
    if (node && !node.contains(path[0]) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("clickedOutisde", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
