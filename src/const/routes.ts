export const ROUTES: {
  HOME: ClientLinkRouteObj;
  ASK_DOCTOR: ClientLinkRouteObj;
  ABOUT_US: ClientLinkRouteObj;
  CONTACT_US: ClientLinkRouteObj;
} = {
  HOME: {
    path: "/",
    name: "Home",
  },
  ASK_DOCTOR: {
    path: "/ask-doctor",
    name: "Ask doctor",
  },
  ABOUT_US: {
    path: "/about",
    name: "About us",
  },
  CONTACT_US: {
    path: "/contacts",
    name: "Contact us",
  },
};

export const ROUTES_ARR = [ROUTES.HOME, ROUTES.ASK_DOCTOR, ROUTES.ABOUT_US, ROUTES.CONTACT_US];
