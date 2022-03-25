import { onAuthStateChanged, User } from "firebase/auth";
import { useState } from "react";
import { auth } from "../lib/firebase";

const useUser = (
  onUserStateChanged?: (user: User | null) => void
): [User | null, boolean] => {
  const [user, setUser] = useState(auth?.currentUser);
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    if (loading) setLoading(false);
    if (onUserStateChanged) onUserStateChanged(user);
  });

  return [user, loading];
};

export default useUser;
