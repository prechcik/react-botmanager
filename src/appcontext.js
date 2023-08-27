import React from "react";

export let toasts = [];

export const AppContext = React.createContext({
	toasts: toasts,
});
