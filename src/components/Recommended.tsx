import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { parseError } from "../utils/helper";
import SkeBookList from "./skeletons/SkeBookList";
import RecommendedBooks from "./RecommendedBooks";

interface Props {
  id?: string;
};


export interface IRecommendedBooks {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
};



const RecommendedSection: FC<Props> = ({ id }) => {
  const [fetching, setFetching] = useState(true);
  const [recombooks, setRecomBooks] = useState<IRecommendedBooks[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchBooks = async () => {
      try {
        const { data } = await client.get("/book/recommended/" + id);
        setRecomBooks(data.books);
      } catch (error) {
        parseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchBooks();
  }, [id]);

  if (!id) return null;

  if (fetching) return <SkeBookList />;

  return (
    <div>
      <RecommendedBooks data={recombooks} title="Related Books" />
    </div>
  );
};

export default RecommendedSection;