def dashboard_snapshot():
    return {
        "averageRetention": 81,
        "averageConfusion": 33,
        "weeklyReviews": 27,
        "dueToday": 3,
        "focusScore": 84,
        "projectedForgetRisk": 21,
    }


def heatmap_snapshot():
    return [
        {"label": "Tracing vs logging", "retention": 66, "confusion": 62, "difficulty": 58},
        {"label": "Validation loss", "retention": 58, "confusion": 55, "difficulty": 74},
        {"label": "External validity", "retention": 79, "confusion": 36, "difficulty": 46},
    ]
