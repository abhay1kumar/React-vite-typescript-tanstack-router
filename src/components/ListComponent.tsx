import useInfiniteScroll from "../hooks/useInfiniteScroll";
import React, { useState } from "react";

const ListComponent: React.FC = () => {
  const [items, setItems] = useState<number[]>([...Array(20).keys()]);

  const fetchMore = () => {
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        ...Array.from({ length: 20 }, (_, i) => i + prev.length), // Corrected line
      ]);
    }, 1000);
  };

  const [lastElementRef, isFetching] = useInfiniteScroll(fetchMore);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
      {isFetching && <p>Loading more items...</p>}
      <div ref={lastElementRef} />
    </div>
  );
};

export default ListComponent;
