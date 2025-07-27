-- Updates for annotation entries with missing fields

UPDATE annotations SET
                       text_id = '17bd0e0e-9a5c-4d1a-8ac6-9f68bc5af56d',
                       content = 'مرحبا is a common greeting in Arabic, equivalent to "hello" in English.',
                       type = 'VOCABULARY',
                       color = '#4CAF50',
                       created_at = '2025-07-27 13:01:22.807591',
                       anchor_text = 'مرحبا',
                       mastery_level = 'NEW',
                       needs_review = false,
                       next_review_date = NULL
WHERE id = 'eb1a84d3-6faa-4c2d-a34a-7c33008e5970';

UPDATE annotations SET
                       text_id = '17bd0e0e-9a5c-4d1a-8ac6-9f68bc5af56d',
                       content = 'كيف حالك is a common phrase asking "how are you" in Arabic.',
                       type = 'VOCABULARY',
                       color = '#2196F3',
                       created_at = '2025-07-27 13:01:22.807591',
                       anchor_text = 'كيف حالك',
                       mastery_level = 'NEW',
                       needs_review = false,
                       next_review_date = NULL
WHERE id = 'faef2b15-3be1-4082-94c1-966c2d69d1b8';

UPDATE annotations SET
                       text_id = 'c0316477-cdfb-4363-a0be-873856360272',
                       content = 'In Arabic, adjectives typically follow the noun they modify, as in الطقس جميل (the weather is beautiful).',
                       type = 'GRAMMAR',
                       color = '#FF9800',
                       created_at = '2025-07-27 13:01:22.807591',
                       anchor_text = 'جميل',
                       mastery_level = 'NEW',
                       needs_review = false,
                       next_review_date = NULL
WHERE id = '7b100d82-2df2-4600-b06a-deac34666ade';

UPDATE annotations SET
                       text_id = 'c0316477-cdfb-4363-a0be-873856360272',
                       content = 'The word مشرقة (shining) is a feminine adjective that agrees with الشمس (the sun), which is feminine in Arabic.',
                       type = 'GRAMMAR',
                       color = '#FF9800',
                       created_at = '2025-07-27 13:01:22.807591',
                       anchor_text = 'مشرقة',
                       mastery_level = 'NEW',
                       needs_review = false,
                       next_review_date = NULL
WHERE id = 'de693a71-3a7d-492d-9f88-891ebbb8ee8c';

UPDATE annotations SET
                       text_id = 'e7640660-5640-4ab3-92b1-f6b93546bee7',
                       content = 'The phrase من أشهر means "among the most famous" and is commonly used to highlight important items in a category.',
                       type = 'VOCABULARY',
                       color = '#4CAF50',
                       created_at = '2025-07-27 13:01:22.807591',
                       anchor_text = 'من أشهر',
                       mastery_level = 'NEW',
                       needs_review = false,
                       next_review_date = NULL
WHERE id = '4e4501ac-c3da-4fec-aadd-4b2563388007';

UPDATE annotations SET
                       text_id = 'e7640660-5640-4ab3-92b1-f6b93546bee7',
                       content = 'الكسكس (couscous) is a staple food in North African cuisine, made from semolina grains.',
                       type = 'CULTURAL',
                       color = '#9C27B0',
                       created_at = '2025-07-27 13:01:22.807591',
                       anchor_text = 'الكسكس',
                       mastery_level = 'NEW',
                       needs_review = false,
                       next_review_date = NULL
WHERE id = 'd109958b-2962-4559-945e-fa3bcc3fa6fe';

UPDATE annotations SET
                       text_id = 'e7640660-5640-4ab3-92b1-f6b93546bee7',
                       content = 'الطاجين (tagine) is a traditional North African dish named after the earthenware pot in which it is cooked.',
                       type = 'CULTURAL',
                       color = '#9C27B0',
                       created_at = '2025-07-27 13:01:22.807591',
                       anchor_text = 'الطاجين',
                       mastery_level = 'NEW',
                       needs_review = false,
                       next_review_date = NULL
WHERE id = 'dcae0686-ce57-44fd-b816-c50d558a6ceb';
