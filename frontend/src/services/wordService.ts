import apiClient from './api';
import { Word, WordsRequest, WordsResponse } from '../types/models';

export const wordService = {
  /**
   * Get a list of words with pagination and filtering
   */
  async getWords(params: WordsRequest = {}): Promise<WordsResponse> {
    const response = await apiClient.get('/words', { params });
    return response.data;
  },

  /**
   * Get a single word by ID
   */
  async getWord(id: string): Promise<Word> {
    const response = await apiClient.get(`/words/${id}`);
    return response.data;
  },

  /**
   * Create a new word
   */
  async createWord(word: Partial<Word>): Promise<Word> {
    const response = await apiClient.post('/words', word);
    return response.data;
  },

  /**
   * Update an existing word
   */
  async updateWord(id: string, word: Partial<Word>): Promise<Word> {
    const response = await apiClient.put(`/words/${id}`, word);
    return response.data;
  },

  /**
   * Delete a word
   */
  async deleteWord(id: string): Promise<void> {
    await apiClient.delete(`/words/${id}`);
  },

  /**
   * Get words by Arabic root
   */
  async getWordsByRoot(root: string): Promise<Word[]> {
    const response = await apiClient.get(`/words/roots/${root}`);
    return response.data;
  },

  /**
   * Search words with advanced filters
   */
  async searchWords(params: WordsRequest = {}): Promise<WordsResponse> {
    const response = await apiClient.get('/search/words', { params });
    return response.data;
  }
};
