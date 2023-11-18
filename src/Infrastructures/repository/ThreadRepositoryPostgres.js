const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator, timestampGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
    this._timestampGenerator = timestampGenerator;
  }

  async addThread(payload) {
    const { title, body, owner } = payload;
    const id = `thread-${this._idGenerator()}`;
    const date = this._timestampGenerator();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    } else {
      return result.rows[0];
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `
              SELECT threads.id, threads.title, threads.body, threads.date, users.username
                FROM threads
                LEFT JOIN users ON threads.owner = users.id
                WHERE threads.id = $1
                `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    } else {
      return result.rows[0];
    }
  }
}

module.exports = ThreadRepositoryPostgres;
