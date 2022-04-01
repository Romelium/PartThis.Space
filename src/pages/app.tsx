import { app } from "lib/firebase";
import type { NextPage } from "next";

const AppPreview: NextPage = () => {
  return <pre>{JSON.stringify(app, null, 2)}</pre>;
};

export default AppPreview;
