import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout/layout";
import SEO from "../../components/Seo/seo";
import { SingleBlogDetailInterface } from "../../interface/blog-interface";
import {
  CommentInterface,
  SubmitCommentInterface,
} from "../../interface/comment-interface";

export default function BlogDetail() {
  const [blogFetched, setBlogFetched] = useState<boolean>(false);
  const [blogDetail, setBlogDetail] = useState<SingleBlogDetailInterface>({
    id: 0,
    title: "",
    content: "",
    date_updated: "",
    user_name: "",
  });
  const [apiCalled, setApiCalled] = useState<boolean>(false);
  const [commentApiCalled, setCommentApiCalled] = useState<boolean>(false);
  const [commentsFetched, setCommentsFetched] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [submittedCommentContent, setSubmittedCommentContent] =
    useState<SubmitCommentInterface>({ blog: 0, content: "" });

  const router = useRouter();
  const { blog_slug } = router.query;

  useEffect(() => {
    if (!blogFetched && blog_slug) {
      axios
        .get<SingleBlogDetailInterface>(
          `http://localhost:8004/blogs/blog-detail/${blog_slug}/`
        )
        .then((response) => {
          setBlogFetched(true);
          setBlogDetail(response.data);
          setApiCalled(true);
        })
        .catch((error: unknown) => {
          setBlogFetched(false);
          setBlogDetail({
            id: 0,
            title: "",
            content: "",
            date_updated: "",
            user_name: "",
          });
          setApiCalled(false);
        });

      if (apiCalled) {
        return setApiCalled(false);
      }
    }
  }, [apiCalled, blogFetched, blog_slug]);
  useEffect(() => {
    if (blogFetched && blogDetail.title.trim().length > 0 && !commentsFetched) {
      axios
        .get<CommentInterface[]>(
          `http://localhost:8004/blogs/comment/${blogDetail.id}/`
        )
        .then((response) => {
          setCommentsFetched(true);
          setComments(response.data);
          setCommentApiCalled(true);
        })
        .catch((error: unknown) => {
          setCommentsFetched(false);
          setComments([]);
          setCommentApiCalled(false);
        });

      if (commentApiCalled) {
        return setCommentApiCalled(false);
      }
    }
  }, [commentApiCalled, blogFetched, blogDetail, commentsFetched]);

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (event.target) {
      let oldComment = { ...submittedCommentContent };
      oldComment["blog"] = blogDetail.id;
      oldComment["content"] = event.target.value;
      setSubmittedCommentContent(oldComment);
    }
  };
  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:8004/blogs/post-comment/",
        submittedCommentContent
      )
      .then((response) => {
        if (comments.length === 0) {
          setCommentsFetched(true);
        }
        let oldComments = [...comments];
        oldComments.push(response.data);
        setComments(oldComments);
        setSubmittedCommentContent({ blog: 0, content: "" });
      })
      .catch((error) => {
        setSubmittedCommentContent({ blog: 0, content: "" });
      });
  };

  const displayBlogDetail = () => {
    return (
      <>
        <h2 className=" text-xl md:text-2xl flex justify-center mb-8">
          {blogDetail.title}
        </h2>
        <h6 className="flex items-center text-gray-500 mb-4 text-sm md:text-lg">
          Last updated:{" "}
          <span className="italic pl-2">{`${new Date(
            blogDetail.date_updated
          ).toDateString()}`}</span>
        </h6>
        <h4 className="text-sm md:text-lg">{blogDetail.content}</h4>
        <h6 className="flex items-center justify-end text-gray-500 mt-8 text-sm md:text-lg">
          By: <span className="italic pl-2">{blogDetail.user_name}</span>
        </h6>
      </>
    );
  };
  const displayCommentList = () => {
    return comments.map((comment, index) => {
      return (
        <div
          key={`${comment.content.toLowerCase().split(" ").join("-")}-${index}`}
          className="shadow-md p-3 rounded-md shadow-gray-400 mb-4"
        >
          <p>
            {comment.content} -{" "}
            <span className="italic text-teal-500 text-sm">
              {comment.user_name ? comment.user_name : "Anonymous"}
            </span>
          </p>
        </div>
      );
    });
  };
  const displayCommentSubmitForm = () => {
    return (
      <div className="shadow-md p-3 rounded-md shadow-gray-400">
        <form
          onSubmit={submitComment}
          className="md:flex items-start justify-between"
        >
          <textarea
            id="submittedCommitContent"
            name="submittedCommitContent"
            rows={4}
            value={submittedCommentContent.content}
            className="w-full text-md p-2 mr-2 comment_textarea mb-2 md:mb-0"
            placeholder="Enter your comment"
            onChange={handleCommentChange}
          ></textarea>
          <input type="hidden" name="blog" value={blogDetail.id} />
          {submittedCommentContent.content.trim().length === 0 ? (
            <button
              type="submit"
              className="p-2 bg-slate-600 text-gray-100 rounded-md cursor-none pointer-events-none"
            >
              Submit
            </button>
          ) : (
            <button
              type="submit"
              className="p-2 bg-teal-600 text-gray-100 rounded-md cursor-pointer pointer-events-auto"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    );
  };

  if (blogFetched) {
    return (
      <Layout>
        <SEO seo_title={blogDetail.title} seo_description={blogDetail.title} />
        <div className="border shadow-md rounded-md p-4 mt-4 mb-8">
          {displayBlogDetail()}
        </div>
        <div className="border shadow-md rounded-md p-4 mt-4 mb-8">
          <h4 className="text-xl md:text-2xl flex mb-4">Comments</h4>
          {!commentsFetched || comments.length === 0
            ? null
            : displayCommentList()}
          {displayCommentSubmitForm()}
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <SEO
          seo_title={"Single Blog Page"}
          seo_description={"This page contains blog detail"}
        />
        <h1>Loading...</h1>
      </Layout>
    );
  }
}
