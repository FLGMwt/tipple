import { Card, Comment, Spin, Row, Input, Button } from 'antd';
import React, { FC, useMemo, useCallback } from 'react';
import { useFetch, usePush, FetchState, single, many } from 'tipple';
import { useState } from 'react';

export const Post: FC<{ post: PostData }> = ({ post }) => {
  const [comments] = useFetch<CommentData[]>(`/comments/?postId=${post.id}`, {
    domains: comments => comments.map(c => single('comments', c.id)),
  });

  const commentsContent = useMemo(() => getComments(comments, post.id), [
    comments,
  ]);

  return (
    <Row>
      <Card>
        <h2>{post.title}</h2>
        {commentsContent}
      </Card>
    </Row>
  );
};

const getComments = (comments: FetchState<CommentData[]>, postId: number) => {
  const [commentInput, setCommentInput] = useState('');
  const [response, addComment, clearResponse] = usePush<CommentData>(
    '/comments',
    {
      domains: comment => [many('comments')],
      fetchOptions: {
        method: 'POST',
        body: JSON.stringify({ postId, body: commentInput }),
      },
    }
  );

  const handleInput = useCallback(
    (e: any) => setCommentInput(e.target.value),
    []
  );

  if (response.data !== undefined) {
    clearResponse();
    setCommentInput('');
  }

  if (comments.fetching && comments.data === undefined) {
    return <Spin />;
  }

  if (comments.error || comments.data === undefined) {
    return <p>Unable to fetch comments</p>;
  }

  return (
    <>
      <div className="ant-list-header">{comments.data.length} replies</div>
      <hr />
      {comments.data.map(comment => (
        <Comment key={comment.id} content={comment.body} />
      ))}
      <Input
        placeholder={'Add comment'}
        value={commentInput}
        onChange={handleInput}
      />
      <Button onClick={addComment}>Reply</Button>
    </>
  );
};
