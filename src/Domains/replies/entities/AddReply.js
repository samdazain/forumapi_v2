class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, content, owner } = payload;

    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ commentId, content, owner }) {
    if (!owner) {
      throw new Error('ADD_REPLY.NOT_MEET_AUTHENTICATION_DATA');
    }
    if (!commentId || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof commentId !== 'string'
      || typeof content !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
