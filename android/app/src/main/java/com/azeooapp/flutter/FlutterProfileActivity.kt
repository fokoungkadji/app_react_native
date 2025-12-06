package com.azeooapp.flutter

import android.content.Context
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

/**
 * Activity Flutter pour afficher le profil utilisateur
 *
 * Cette activity utilise le FlutterEngine pré-initialisé
 * pour un démarrage rapide.
 */
class FlutterProfileActivity : FlutterActivity() {

    override fun provideFlutterEngine(context: Context): FlutterEngine? {
        // Utiliser le FlutterEngine en cache pour un démarrage rapide
        return FlutterEngineManager.getEngine()
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        // Récupérer l'userId depuis l'intent
        val userId = intent.getStringExtra("user_id") ?: "1"

        // Mettre à jour l'userId dans le module Flutter
        FlutterEngineManager.updateUserId(userId)
    }

    override fun onDestroy() {
        // Ne pas détruire le FlutterEngine, il est géré par FlutterEngineManager
        super.onDestroy()
    }
}
