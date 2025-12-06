package com.azeooapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.azeooapp.flutter.FlutterModulePackage
import com.azeooapp.flutter.FlutterEngineManager

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Ajouter le package Flutter Module
          add(FlutterModulePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    // Initialiser le FlutterEngine pour un démarrage rapide
    initializeFlutterEngine()
  }

  private fun initializeFlutterEngine() {
    try {
      FlutterEngineManager.initialize(this)
    } catch (e: Exception) {
      // Log l'erreur mais ne pas crasher l'app
      android.util.Log.e("MainApplication", "Failed to initialize Flutter Engine: ${e.message}")
    }
  }
}
