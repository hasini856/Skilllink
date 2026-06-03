
import { Router } from 'express';
import * as skillController from '../controllers/skill.controller.js';

const router = Router();

router.get('/', skillController.getSkills);
router.get('/:id', skillController.getSkillById);
router.post('/', skillController.createSkill);

export default router;
