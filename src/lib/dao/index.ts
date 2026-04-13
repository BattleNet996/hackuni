/**
 * DAO Factory
 * Automatically selects SQLite or Supabase implementation based on environment
 */

import { isUsingSupabase } from '../db/database';
import { UserDAO } from './users';
import { UserSupabaseDAO } from './users.supabase';
import { HackathonDAO } from './hackathons';
import { HackathonSupabaseDAO } from './hackathons.supabase';
import { ProjectDAO } from './projects';
import { ProjectSupabaseDAO } from './projects.supabase';
import { StoryDAO } from './stories';
import { StorySupabaseDAO } from './stories.supabase';
import { BadgeDAO } from './badges';
import { BadgeSupabaseDAO } from './badges.supabase';
import { LikeDAO } from './comments';
import { LikeSupabaseDAO } from './likes.supabase';
import { CommentDAO } from './comments.dao';
import { CommentSupabaseDAO } from './comments.supabase';

// User DAO adapter for SQLite to handle create method
class UserDAOAdapter {
  constructor(private dao: UserDAO) {}

  findById = this.dao.findById.bind(this.dao);
  findAll = this.dao.findAll.bind(this.dao);
  count = this.dao.count.bind(this.dao);
  exists = this.dao.exists.bind(this.dao);
  delete = this.dao.delete.bind(this.dao);
  update = this.dao.update.bind(this.dao);
  getPaginated = this.dao.getPaginated.bind(this.dao);

  findByEmail = this.dao.findByEmail.bind(this.dao);
  verifyPassword = this.dao.verifyPassword.bind(this.dao);
  updateStats = this.dao.updateStats.bind(this.dao);
  findByIds = (this.dao as any).findByIds?.bind(this.dao);
  search = (this.dao as any).search?.bind(this.dao);
  getTopByHackathons = (this.dao as any).getTopByHackathons?.bind(this.dao);
  getTopByAwards = (this.dao as any).getTopByAwards?.bind(this.dao);
  getTopByWorkCount = (this.dao as any).getTopByWorkCount?.bind(this.dao);

  async create(input: any): Promise<any> {
    return (this.dao as any).createWithPassword(input);
  }
}

// User DAO adapter for Supabase to handle create method
class UserSupabaseDAOAdapter {
  constructor(private dao: UserSupabaseDAO) {}

  findById = this.dao.findById.bind(this.dao);
  findAll = this.dao.findAll.bind(this.dao);
  count = this.dao.count.bind(this.dao);
  exists = this.dao.exists.bind(this.dao);
  delete = this.dao.delete.bind(this.dao);
  update = this.dao.update.bind(this.dao);
  getPaginated = this.dao.getPaginated.bind(this.dao);

  findByEmail = this.dao.findByEmail.bind(this.dao);
  verifyPassword = this.dao.verifyPassword.bind(this.dao);
  updateStats = this.dao.updateStats.bind(this.dao);
  findByIds = this.dao.findByIds.bind(this.dao);
  search = this.dao.search.bind(this.dao);
  getTopByHackathons = this.dao.getTopByHackathons.bind(this.dao);
  getTopByAwards = this.dao.getTopByAwards.bind(this.dao);
  getTopByWorkCount = this.dao.getTopByWorkCount.bind(this.dao);

  async create(input: any): Promise<any> {
    return this.dao.create(input);
  }
}

// Comment DAO adapter for SQLite to handle create method
class CommentDAOAdapter {
  constructor(private dao: CommentDAO) {}

  findById = this.dao.findById.bind(this.dao);
  findAll = this.dao.findAll.bind(this.dao);
  count = this.dao.count.bind(this.dao);
  exists = this.dao.exists.bind(this.dao);
  delete = this.dao.delete.bind(this.dao);
  update = this.dao.update.bind(this.dao);
  getPaginated = this.dao.getPaginated.bind(this.dao);

  findByCode = (this.dao as any).findByCode?.bind(this.dao);
  getUserBadges = (this.dao as any).getUserBadges?.bind(this.dao);
  getProjectComments = this.dao.getProjectComments.bind(this.dao);
  getStoryComments = this.dao.getStoryComments.bind(this.dao);
  getReplies = this.dao.getReplies.bind(this.dao);
  incrementLikes = this.dao.incrementLikes.bind(this.dao);
  decrementLikes = this.dao.decrementLikes.bind(this.dao);

  async create(input: any, authorId: string, authorName?: string): Promise<any> {
    return (this.dao as any).createWithAuthor(input, authorId, authorName || '');
  }
}

// Comment DAO adapter for Supabase to handle create method
class CommentSupabaseDAOAdapter {
  constructor(private dao: CommentSupabaseDAO) {}

  findById = this.dao.findById.bind(this.dao);
  findAll = this.dao.findAll.bind(this.dao);
  count = this.dao.count.bind(this.dao);
  exists = this.dao.exists.bind(this.dao);
  delete = this.dao.delete.bind(this.dao);
  update = this.dao.update.bind(this.dao);
  getPaginated = this.dao.getPaginated.bind(this.dao);

  findByCode = (this.dao as any).findByCode?.bind(this.dao);
  getUserBadges = (this.dao as any).getUserBadges?.bind(this.dao);
  getByTarget = this.dao.getByTarget.bind(this.dao);
  getByUserId = this.dao.getByUserId.bind(this.dao);
  countByTarget = this.dao.countByTarget.bind(this.dao);
  deleteByTarget = this.dao.deleteByTarget.bind(this.dao);
  getRecent = this.dao.getRecent.bind(this.dao);
  getProjectComments = this.dao.getProjectComments.bind(this.dao);
  getStoryComments = this.dao.getStoryComments.bind(this.dao);
  getReplies = this.dao.getReplies.bind(this.dao);
  incrementLikes = this.dao.incrementLikes.bind(this.dao);
  decrementLikes = this.dao.decrementLikes.bind(this.dao);

  async create(input: any, authorId: string, authorName?: string): Promise<any> {
    return (this.dao as any).createWithAuthor(input, authorId, authorName);
  }
}

// Project DAO adapter for SQLite to handle create method
class ProjectDAOAdapter {
  constructor(private dao: ProjectDAO) {}

  findById = this.dao.findById.bind(this.dao);
  findAll = this.dao.findAll.bind(this.dao);
  count = this.dao.count.bind(this.dao);
  exists = this.dao.exists.bind(this.dao);
  delete = this.dao.delete.bind(this.dao);
  update = this.dao.update.bind(this.dao);
  getPaginated = this.dao.getPaginated.bind(this.dao);

  getTopRanked = this.dao.getTopRanked.bind(this.dao);
  getMostLiked = this.dao.getMostLiked.bind(this.dao);
  updateLikeCount = this.dao.updateLikeCount.bind(this.dao);
  findByAuthorId = this.dao.findByAuthorId.bind(this.dao);

  async create(input: any, authorId: string): Promise<any> {
    return (this.dao as any).createWithAuthor(input, authorId);
  }
}

// Project DAO adapter for Supabase to handle create method
class ProjectSupabaseDAOAdapter {
  constructor(private dao: ProjectSupabaseDAO) {}

  findById = this.dao.findById.bind(this.dao);
  findAll = this.dao.findAll.bind(this.dao);
  count = this.dao.count.bind(this.dao);
  exists = this.dao.exists.bind(this.dao);
  delete = this.dao.delete.bind(this.dao);
  update = this.dao.update.bind(this.dao);
  getPaginated = this.dao.getPaginated.bind(this.dao);

  getTopRanked = this.dao.getTopRanked.bind(this.dao);
  getMostLiked = this.dao.getMostLiked.bind(this.dao);
  updateLikeCount = this.dao.updateLikeCount.bind(this.dao);
  findByAuthorId = this.dao.findByAuthorId.bind(this.dao);
  findByHackathonId = (this.dao as any).findByHackathonId?.bind(this.dao);
  search = (this.dao as any).search?.bind(this.dao);
  getAwarded = (this.dao as any).getAwarded?.bind(this.dao);

  async create(input: any, authorId: string): Promise<any> {
    return (this.dao as any).create(input, authorId);
  }
}

// Get the appropriate database client
function getDAO() {
  if (isUsingSupabase()) {
    const supabaseUserDAO = new UserSupabaseDAO();
    const supabaseCommentDAO = new CommentSupabaseDAO();
    const supabaseProjectDAO = new ProjectSupabaseDAO();
    return {
      user: new UserSupabaseDAOAdapter(supabaseUserDAO),
      hackathon: new HackathonSupabaseDAO(),
      project: new ProjectSupabaseDAOAdapter(supabaseProjectDAO),
      story: new StorySupabaseDAO(),
      badge: new BadgeSupabaseDAO(),
      like: new LikeSupabaseDAO(),
      comment: new CommentSupabaseDAOAdapter(supabaseCommentDAO)
    };
  } else {
    const { getDb } = require('../db/client');
    const db = getDb();
    const sqliteUserDAO = new UserDAO(db);
    const sqliteCommentDAO = new CommentDAO(db);
    const sqliteProjectDAO = new ProjectDAO(db);

    return {
      user: new UserDAOAdapter(sqliteUserDAO),
      hackathon: new HackathonDAO(db),
      project: new ProjectDAOAdapter(sqliteProjectDAO),
      story: new StoryDAO(db),
      badge: new BadgeDAO(db),
      like: new LikeDAO(db),
      comment: new CommentDAOAdapter(sqliteCommentDAO)
    };
  }
}

// Lazy initialization - only create DAOs when first accessed
let cachedDao: ReturnType<typeof getDAO> | null = null;

function getDAOInstance() {
  if (!cachedDao) {
    cachedDao = getDAO();
    console.log('🔍 Database type:', isUsingSupabase() ? 'Supabase' : 'SQLite');
  }
  return cachedDao;
}

export const userDAO = new Proxy({} as any, {
  get(_, prop) { return getDAOInstance().user[prop]; }
});
export const hackathonDAO = new Proxy({} as any, {
  get(_, prop) { return getDAOInstance().hackathon[prop]; }
});
export const projectDAO = new Proxy({} as any, {
  get(_, prop) { return getDAOInstance().project[prop]; }
});
export const storyDAO = new Proxy({} as any, {
  get(_, prop) { return getDAOInstance().story[prop]; }
});
export const badgeDAO = new Proxy({} as any, {
  get(_, prop) { return getDAOInstance().badge[prop]; }
});
export const likeDAO = new Proxy({} as any, {
  get(_, prop) { return getDAOInstance().like[prop]; }
});
export const commentDAO = new Proxy({} as any, {
  get(_, prop) { return getDAOInstance().comment[prop]; }
});

// Re-export types
export type { User, UserCreateInput, UserUpdateInput } from '@/lib/models/user';
export type { Hackathon } from '@/lib/models/hackathon';
export type { Project, ProjectCreateInput, ProjectUpdateInput } from '@/lib/models/project';
export type { Story } from '@/lib/models/story';
export type { Badge, UserBadge } from '@/lib/models/badge';
export type { Like } from '@/lib/models/like';
export type { Comment } from '@/lib/models/comment';
