import * as React from "react";

import { BodyWidget } from "./schemaPack/widgets/BodyWidget";
import { Application } from "./schemaPack/Application";

import "./schemaPack/css/main.css";

const Schema = () => {
	var app = new Application();
	return <BodyWidget app={app} />;
};

export default Schema;
