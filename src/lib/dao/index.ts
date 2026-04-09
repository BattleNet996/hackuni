import { getDb } from '../db/client';
import { UserDAO } from './users';
import { HackathonDAO } from './hackathons';
import { ProjectDAO } from './projects';
import { StoryDAO } from './stories';
import { BadgeDAO } from './badges';
import { LikeDAO } from './comments';
import { CommentDAO } from './comments.dao';

const db = getDb();

export const userDAO = new UserDAO(db);
export const hackathonDAO = new HackathonDAO(db);
export const projectDAO = new ProjectDAO(db);
export const storyDAO = new StoryDAO(db);
export const badgeDAO = new BadgeDAO(db);
export const likeDAO = new LikeDAO(db);
export const commentDAO = new CommentDAO(db);
