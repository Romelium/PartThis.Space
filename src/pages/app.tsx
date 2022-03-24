import type { NextPage } from "next";
import { app } from "../lib/firebase";

const AppPreview: NextPage = () => {
  return <pre>{JSON.stringify(app, null, 2)}</pre>;
};

export default AppPreview;
