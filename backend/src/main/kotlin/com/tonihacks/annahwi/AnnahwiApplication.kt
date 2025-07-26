package com.tonihacks.annahwi

import io.quarkus.runtime.Quarkus
import io.quarkus.runtime.QuarkusApplication
import io.quarkus.runtime.annotations.QuarkusMain
import org.jboss.logging.Logger

@QuarkusMain
class AnnahwiApplication : QuarkusApplication {
    
    private val logger = Logger.getLogger(AnnahwiApplication::class.java)
    
    override fun run(vararg args: String): Int {
        logger.info("An-Nahwi application starting...")
        Quarkus.waitForExit()
        return 0
    }
    
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            Quarkus.run(AnnahwiApplication::class.java, *args)
        }
    }
}
