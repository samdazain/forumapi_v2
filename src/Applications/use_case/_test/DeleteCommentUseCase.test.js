const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve({
      id: 'thread-123',
    }));

    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve({
      id: 'comment-123',
    }));

    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );

    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );

    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload,
    );

    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload);
  });

  it('should throw error if use case payload not contain owner', async () => {
    // Arrange
    const useCasePayload = {
      threadId: {},
      commentId: [],
      owner: undefined,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER');
  });

  it('should throw error if use case payload not contain threadId, commentId', async () => {
    // Arrange
    const useCasePayload = {
      threadId: undefined,
      commentId: undefined,
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: {},
      commentId: [],
      owner: 123,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload),
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
