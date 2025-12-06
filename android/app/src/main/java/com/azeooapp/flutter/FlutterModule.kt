package com.azeooapp.flutter

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

/**
 * Module natif React Native pour intégrer le SDK Flutter
 *
 * Ce module expose des méthodes JavaScript permettant d'ouvrir
 * et de contrôler le module Flutter depuis React Native.
 */
class FlutterModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "FlutterModule"
        const val FLUTTER_ACTIVITY_REQUEST_CODE = 1001
    }

    override fun getName(): String = NAME

    /**
     * Ouvre la vue Flutter avec le profil de l'utilisateur spécifié
     *
     * @param userId L'identifiant de l'utilisateur à afficher
     * @param promise Promise pour retourner le résultat à JavaScript
     */
    @ReactMethod
    fun openFlutterView(userId: String, promise: Promise) {
        try {
            val activity: Activity? = reactContext.currentActivity
            if (activity == null) {
                promise.reject("ERROR", "Activity not available")
                return
            }

            // Lancer l'activité Flutter
            val intent = Intent(activity, FlutterProfileActivity::class.java)
            intent.putExtra("user_id", userId)
            activity.startActivityForResult(intent, FLUTTER_ACTIVITY_REQUEST_CODE)

            promise.resolve("Flutter view opened with userId: $userId")
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to open Flutter view: ${e.message}")
        }
    }

    /**
     * Met à jour l'userId et rafraîchit le profil Flutter
     *
     * @param userId Le nouvel identifiant utilisateur
     * @param promise Promise pour retourner le résultat à JavaScript
     */
    @ReactMethod
    fun updateUserId(userId: String, promise: Promise) {
        try {
            // Envoyer un message au Flutter Engine via le Method Channel
            FlutterEngineManager.updateUserId(userId)

            promise.resolve("UserId updated to: $userId")
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to update userId: ${e.message}")
        }
    }

    /**
     * Récupère l'userId actuellement configuré
     *
     * @param promise Promise pour retourner le résultat à JavaScript
     */
    @ReactMethod
    fun getCurrentUserId(promise: Promise) {
        promise.resolve(FlutterEngineManager.getCurrentUserId())
    }

    /**
     * Vérifie si Flutter est disponible
     *
     * @param promise Promise pour retourner le résultat à JavaScript
     */
    @ReactMethod
    fun isFlutterReady(promise: Promise) {
        promise.resolve(FlutterEngineManager.getEngine() != null)
    }
}
