package com.azeooapp.flutter

import android.content.Context
import android.os.Handler
import android.os.Looper
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.embedding.engine.FlutterEngineCache
import io.flutter.embedding.engine.dart.DartExecutor
import io.flutter.plugin.common.MethodChannel

object FlutterEngineManager {

    private const val ENGINE_ID = "azeoo_profile_engine"
    private const val CHANNEL_NAME = "com.azeoo.profile_sdk/channel"

    private var flutterEngine: FlutterEngine? = null
    private var methodChannel: MethodChannel? = null
    private var currentUserId: String = "1"

    private val mainHandler = Handler(Looper.getMainLooper())

    fun initialize(context: Context) {
        if (flutterEngine != null) return

        flutterEngine = FlutterEngine(context).apply {
            dartExecutor.executeDartEntrypoint(
                DartExecutor.DartEntrypoint.createDefault()
            )
        }

        FlutterEngineCache.getInstance().put(ENGINE_ID, flutterEngine!!)

        setupMethodChannel()
    }

    private fun setupMethodChannel() {
        flutterEngine?.let { engine ->
            methodChannel = MethodChannel(
                engine.dartExecutor.binaryMessenger,
                CHANNEL_NAME
            )

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

    fun getEngine(): FlutterEngine? {
        return FlutterEngineCache.getInstance().get(ENGINE_ID)
    }

    fun updateUserId(userId: String) {
        currentUserId = userId

        mainHandler.post {
            methodChannel?.invokeMethod("updateUserId", userId)
        }
    }

    fun getCurrentUserId(): String = currentUserId

    fun destroy() {
        FlutterEngineCache.getInstance().remove(ENGINE_ID)
        flutterEngine?.destroy()
        flutterEngine = null
        methodChannel = null
    }
}
