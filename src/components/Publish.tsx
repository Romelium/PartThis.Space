import Router from "next/router";
import { FormEventHandler } from "react";
import useUser from "../hooks/useUser";

const Publish = () => {
  const [user, loading] = useUser();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault(); // don't redirect the page

    const {
      title: { value: title },
      source: { value: source },
    } = event.target as EventTarget & {
      title: HTMLInputElement;
      source: HTMLTextAreaElement;
    };

    if (user) {
      const res = await fetch("/api/publish", {
        method: "POST",
        body: JSON.stringify({
          title,
          source,
          idToken: await user.getIdToken(),
        }),
      });
      console.log(await res.json());
      Router.reload();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={loading || !user?.emailVerified}>
        <label>
          Title:
          <br />
          <input name="title" type="text" required />
        </label>
        <br />
        <label>
          Source:
          <br />
          <textarea name="source" required />
        </label>
        <br />
        <input type="submit" value="Publish" />
      </fieldset>
    </form>
  );
};

export default Publish;
