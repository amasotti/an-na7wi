package com.tonihacks.annahwi.util

import org.jboss.logging.Logger

fun <T> loggerFor(clazz: Class<T>): Logger = Logger.getLogger(clazz)
