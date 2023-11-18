const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
    }));

    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        likeCount: 1,
      },
    ]));

    mockReplyRepository.getReplyByCommentId = jest.fn(() => Promise.resolve([
      {
        id: 'reply-123',
        content: 'sebuah reply',
        date: '2021-08-09T08:15:30.123Z',
        username: 'dicoding',
      },
    ]));

    mockLikeRepository.getLikeCount = jest.fn(() => Promise.resolve(1));

    // Create Instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);

    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      useCasePayload,
    );

    expect(mockReplyRepository.getReplyByCommentId).toBeCalledWith(
      'comment-123',
    );

    expect(mockLikeRepository.getLikeCount).toBeCalledWith('comment-123');

    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          likeCount: 1,
          replies: [
            {
              id: 'reply-123',
              content: 'sebuah reply',
              date: '2021-08-09T08:15:30.123Z',
              username: 'dicoding',
            },
          ],
        },
      ],
    });
  });

  it('should orchestrating the get thread action correctly with is_deleted true', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
    }));

    mockCommentRepository.getCommentByThreadId = jest.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        date: '2021-08-08T07:22:33.555Z',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: true,
        username: 'dicoding',
      },
    ]));

    mockReplyRepository.getReplyByCommentId = jest.fn(() => Promise.resolve([
      {
        id: 'reply-123',
        content: '**balasan telah dihapus**',
        date: '2021-08-09T08:15:30.123Z',
        owner: 'user-123',
        comment_id: 'comment-123',
        is_delete: true,
        username: 'dicoding',
      },
    ]));

    mockLikeRepository.getLikeCount = jest.fn(() => Promise.resolve(1));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);

    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      useCasePayload,
    );

    expect(mockReplyRepository.getReplyByCommentId).toBeCalledWith(
      'comment-123',
    );

    expect(mockLikeRepository.getLikeCount).toBeCalledWith('comment-123');

    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:22:33.555Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**',
          likeCount: 1,
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: '2021-08-09T08:15:30.123Z',
              username: 'dicoding',
            },
          ],
        },
      ],
    });
  });
});
