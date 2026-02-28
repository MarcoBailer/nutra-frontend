/**
 * @fileoverview Exportação centralizada de todos os serviços da API Nutra.
 * 
 * Este arquivo reexporta todos os serviços para facilitar a importação
 * em componentes e páginas.
 * 
 * @example
 * ```ts
 * import { accountService, foodSearchService } from '@/services';
 * 
 * const user = await accountService.getProfile();
 * const foods = await foodSearchService.searchAll('banana');
 * ```
 * 
 * SERVIÇOS DISPONÍVEIS:
 * - accountService: Gerenciamento de conta do usuário
 * - userProfileService: Perfil nutricional e preferências
 * - foodSearchService: Busca de alimentos em todas as tabelas
 * - mealPlanService: Gerenciamento de planos alimentares
 * - foodDiaryService: Diário alimentar e registro de consumo
 * - nutritionalAssessmentService: Avaliações antropométricas
 * - quickMealService: Registro rápido de refeições
 */

export { accountService } from './account.service';
export { userProfileService } from './user-profile.service';
export { foodSearchService } from './food-search.service';
export { mealPlanService } from './meal-plan.service';
export { foodDiaryService } from './food-diary.service';
export { nutritionalAssessmentService } from './nutritional-assessment.service';
export { quickMealService } from './quick-meal.service';
