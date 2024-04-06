import { create } from 'zustand';

export type CommentType = {
  user_id: string | null;
  comment_id: string | null;
  comment_content: string | null;
  created_at: string | null;
  review_id: string | null;
};

type CommentState = {
  comments: CommentType[];
  addComment: (comment: CommentType) => void;
  deleteComment: (commentId: string) => void;
};

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
  deleteComment: (commentId) =>
    set((state) => ({ comments: state.comments.filter((comment) => comment.comment_id !== commentId) }))
}));
