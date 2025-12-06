package com.azeooapp.flutter

import android.content.Context
import android.os.Handler
import android.os.Looper
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.embedding.engine.FlutterEngineCache
import io.flutter.embedding.engine.dart.DartExecutor
import io.flutter.plugin.common.MethodChannel

/**
 * Gestionnaire singleton du FlutterEngine
 *
 * Cette classe gère le cycle de vie du FlutterEngine et permet
 * un démarrage rapide de la vue Flutter grâce au pré-warming.
 */
object FlutterEngineManager {

    private const val ENGINE_ID = "azeoo_profile_engine"
    private const val CHANNEL_NAME = "com.azeoo.profile_sdk/channel"

    private var flutterEngine: FlutterEngine? = null
    private var methodChannel: MethodChannel? = null
    private var currentUserId: String = "1"

    // Handler pour exécuter sur le thread principal
    private val mainHandler = Handler(Looper.getMainLooper())

    /**
     * Initialise le FlutterEngine
     *
     * Doit être appelé au démarrage de l'application (dans Application.onCreate())
     * pour permettre un démarrage rapide de la vue Flutter.
     */
    fun initialize(context: Context) {
        if (flutterEngine != null) return

        // Créer et configurer le FlutterEngine
        flutterEngine = FlutterEngine(context).apply {
            // Démarrer l'exécution Dart
            dartExecutor.executeDartEntrypoint(
                DartExecutor.DartEntrypoint.createDefault()
            )
        }

        // Mettre en cache le FlutterEngine pour un accès rapide
        FlutterEngineCache.getInstance().put(ENGINE_ID, flutterEngine!!)

        // Configurer le Method Channel pour la communication
        setupMethodChannel()
    }

    /**
     * Configure le Method Channel pour la communication avec Flutter
     */
    private fun setupMethodChannel() {
        flutterEngine?.let { engine ->
            methodChannel = MethodChannel(
                engine.dartExecutor.binaryMessenger,
                CHANNEL_NAME
            )

            // Gérer les appels depuis Flutter
            methodChannel?.setMethodCallHandler { call, result ->
                when (call.method) {
                    "getInitialUserId" -> {
                        result.success(currentUserId)
                    }
                    else -> {
                        result.notImplemented()
                    }
                }
            }
        }
    }

    /**
     * Retourne le FlutterEngine en cache
     */
    fun getEngine(): FlutterEngine? {
        return FlutterEngineCache.getInstance().get(ENGINE_ID)
    }

    /**
     * Met à jour l'userId et notifie Flutter
     * L'appel au MethodChannel est fait sur le thread principal (UI thread)
     */
    fun updateUserId(userId: String) {
        currentUserId = userId

        // Exécuter sur le thread principal car MethodChannel requiert @UiThread
        mainHandler.post {
            methodChannel?.invokeMethod("updateUserId", userId)
        }
    }

    /**
     * Retourne l'userId courant
     */
    fun getCurrentUserId(): String = currentUserId

    /**
     * Libère les ressources du FlutterEngine
     */
    fun destroy() {
        FlutterEngineCache.getInstance().remove(ENGINE_ID)
        flutterEngine?.destroy()
        flutterEngine = null
        methodChannel = null
    }
}
