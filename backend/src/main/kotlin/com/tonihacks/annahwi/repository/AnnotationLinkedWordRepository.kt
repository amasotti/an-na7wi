package com.tonihacks.annahwi.repository

import com.tonihacks.annahwi.entity.AnnotationWord
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
class AnnotationLinkedWordRepository : PanacheRepository<AnnotationWord> {

  fun findByWordId(wordId: UUID) : List<AnnotationWord> {
    return find("word.id", wordId).list()
  }

  fun findByAnnotationId(annotationId: UUID): List<AnnotationWord> {
    return find("annotation.id", annotationId).list()
  }

  fun findByTextId(textId: UUID): List<AnnotationWord> {
    return find("text.id", textId).list()
  }


}

