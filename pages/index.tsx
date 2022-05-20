import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/layout";
import SEO from "../components/Seo/seo";
import { BlogInterface } from "../interface/blog-interface";

const Home: NextPage = () => {
  const [blogLists, setBlogLists] = useState<BlogInterface[]>([]);
  const [blogFetched, setBlogFetched] = useState<boolean>(false);
  const [apiCalled, setApiCalled] = useState<boolean>(false);

  useEffect(() => {
    if (!blogFetched) {
      axios
        .get<BlogInterface[]>("http://localhost:8004/blogs/list-query/")
        .then((response) => {
          setBlogFetched(true);
          setBlogLists(response.data);
          setApiCalled(true);
        })
        .catch((error: unknown) => {
          setBlogFetched(false);
          setBlogLists([]);
          setApiCalled(false);
        });

      if (apiCalled) {
        return setApiCalled(false);
      }
    }
  }, [apiCalled, blogFetched]);

  const displayBlogLists = () => {
    if (blogFetched) {
      if (blogLists.length > 0) {
        return blogLists.map((blogList) => {
          return (
            <li key={blogList.slug} className="leading-8">
              <div className="flex items-center">
                <Link href={`blog/${blogList.slug}`}>
                  <a className="text-blue-500 text-sm md:text-lg">
                    {blogList.title}
                  </a>
                </Link>
                <p className="text-gray-500 mx-2">.....................</p>
                <p className="text-gray-500 italic text-sm md:text-lg">
                  {`By ${blogList.user_name}`}
                </p>
              </div>
            </li>
          );
        });
      } else {
        return "No Blogs Found...";
      }
    } else {
      return "Loading...";
    }
  };

  return (
    <Layout>
      <SEO
        seo_title={"Blog Lists"}
        seo_description={"This page contains blog lists"}
      />
      <h2 className="text-4xl flex justify-center mb-8 mt-4">Blogs List</h2>
      <div className="border shadow-md rounded-md">
        <ul className="list-disc p-4 mx-4">{displayBlogLists()}</ul>
      </div>
    </Layout>
  );
};

export default Home;
