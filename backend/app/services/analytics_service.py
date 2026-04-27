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


def retention_curve_data():
    return [
        {"d": "D1", "ret": 100, "no": 100},
        {"d": "D2", "ret": 58, "no": 55},
        {"d": "D3", "ret": 44, "no": 40},
        {"d": "D5", "ret": 71, "no": 28},
        {"d": "D8", "ret": 52, "no": 60},
        {"d": "D12", "ret": 82, "no": 45},
        {"d": "D15", "ret": 68, "no": 75},
        {"d": "D20", "ret": 89, "no": 60},
    ]

