import { useEffect } from "react";
import Chiled from "./Chiled";

const Testing = () => {
  useEffect(() => {
    console.log("Parent");
  }, []);
  return (
    <div>
      <Chiled />
    </div>
  );
};

export default Testing;
