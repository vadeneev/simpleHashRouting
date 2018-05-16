/*
  Simple router for hash routing with callbacks

  example of usage:
  import * as hashRouter from './hash-router.js';

  hashRouter.addRoute(/\d+/, handleRouting); // order matters
  hashRouter.addRoute(/\s?/, handleDefaultRoute); // last (maybe default) route

  hashRouter.executeRoute(); / immediately execute current route

 */
 
let allRoutes;
let event;

export const pushState = (value, title) => {
  if (!value) {
    value = window.location.pathname;
  }
  else {
    value = '#/' + value;
  }
  window.history.pushState({value}, title, value);
  window.dispatchEvent(event);
};

export const addRoute = (match, callback) => {
  init();
  allRoutes.push({
    match: new RegExp(match),
    callback
  });
};

export const executeRoute = () => {
  const currentHash = window.location.hash.replace(/^#/, '');
  for (const route of allRoutes) {
    let match = route.match.exec(currentHash);
    if (match) {
      route.callback({
        match: match[0],
        pattern: route.match
      });
      break;
    }
  }
}

function init() {
  allRoutes = [];
  event = new Event('popstate');
  window.addEventListener('popstate', executeRoute);
  init = () => {};
}
