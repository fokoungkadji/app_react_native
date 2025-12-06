package com.azeooapp.flutter

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
class FlutterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "FlutterModule"
        const val FLUTTER_ACTIVITY_REQUEST_CODE = 1001

        // Variable pour stocker l'userId courant
        var currentUserId: String = "1"

        // Flag to indicate if Flutter is available
        var isFlutterAvailable: Boolean = false
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
        if (!isFlutterAvailable) {
            promise.reject("FLUTTER_NOT_AVAILABLE", "Flutter module is not yet integrated. Please build the Flutter AAR first.")
            return
        }

        try {
            currentUserId = userId
            // Flutter integration will be enabled after AAR is built
            promise.resolve("Flutter view would open with userId: $userId")
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
            currentUserId = userId
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
        promise.resolve(currentUserId)
    }

    /**
     * Vérifie si Flutter est disponible
     *
     * @param promise Promise pour retourner le résultat à JavaScript
     */
    @ReactMethod
    fun isFlutterReady(promise: Promise) {
        promise.resolve(isFlutterAvailable)
    }
}
