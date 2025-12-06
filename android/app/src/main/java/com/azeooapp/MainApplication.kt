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
          add(FlutterModulePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    initializeFlutterEngine()
  }

  private fun initializeFlutterEngine() {
    try {
      FlutterEngineManager.initialize(this)
    } catch (e: Exception) {
      android.util.Log.e("MainApplication", "Failed to initialize Flutter Engine: ${e.message}")
    }
  }
}
