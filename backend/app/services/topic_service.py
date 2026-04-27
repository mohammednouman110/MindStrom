from __future__ import annotations

TOPICS = [
    {"id": 1, "name": "JavaScript", "icon": "⚡", "color": "#FFB800", "strength": 78, "cards": 24, "next": "2h", "cat": "Programming"},
    {"id": 2, "name": "Machine Learning", "icon": "🧠", "color": "#00E5FF", "strength": 45, "cards": 31, "next": "4h", "cat": "AI"},
    {"id": 3, "name": "DevOps", "icon": "🔧", "color": "#7B2FBE", "strength": 62, "cards": 18, "next": "Tomorrow", "cat": "Ops"},
    {"id": 4, "name": "System Design", "icon": "🏗️", "color": "#FF2D78", "strength": 33, "cards": 27, "next": "6h", "cat": "Architecture"},
    {"id": 5, "name": "Python", "icon": "🐍", "color": "#00FF9D", "strength": 89, "cards": 20, "next": "3 days", "cat": "Programming"},
    {"id": 6, "name": "React", "icon": "⚛️", "color": "#61DAFB", "strength": 71, "cards": 16, "next": "1 day", "cat": "Frontend"},
]

FLASHCARDS = [
    {
        "id": 1,
        "topic": "Machine Learning",
        "tc": "#00E5FF",
        "q": "What is the Ebbinghaus Forgetting Curve?",
        "a": "A mathematical model showing memory retention decays exponentially over time without reinforcement. Formula: R = e^(-t/S) where R = retention, t = time, S = memory strength.",
        "diff": "medium",
        "last": "3d ago",
        "str": 45,
    },
    {
        "id": 2,
        "topic": "JavaScript",
        "tc": "#FFB800",
        "q": "Difference between let, const, and var?",
        "a": "var is function-scoped and hoisted. let is block-scoped, not hoisted, mutable. const is block-scoped, not hoisted, and immutable (though referenced objects can be mutated).",
        "diff": "easy",
        "last": "1d ago",
        "str": 78,
    },
    {
        "id": 3,
        "topic": "System Design",
        "tc": "#FF2D78",
        "q": "Explain the CAP Theorem.",
        "a": "In a distributed system you can only guarantee 2 of 3: Consistency (every read sees latest write), Availability (every request gets a response), Partition tolerance (operates despite network splits).",
        "diff": "hard",
        "last": "5d ago",
        "str": 33,
    },
    {
        "id": 4,
        "topic": "DevOps",
        "tc": "#7B2FBE",
        "q": "What is a Kubernetes Pod?",
        "a": "The smallest deployable unit in Kubernetes. A Pod encapsulates one or more containers, storage resources, a unique network IP, and options that govern how containers should run.",
        "diff": "medium",
        "last": "2d ago",
        "str": 62,
    },
]

ACHIEVEMENTS = [
    {"id": 1, "name": "First Blood", "desc": "Complete first review session", "icon": "⚔️", "unlocked": True},
    {"id": 2, "name": "Week Warrior", "desc": "7-day learning streak", "icon": "🔥", "unlocked": True},
    {"id": 3, "name": "Neural Architect", "desc": "Create 50+ flashcards", "icon": "🧠", "unlocked": True},
    {"id": 4, "name": "Speed Learner", "desc": "Review 20 cards in 5 min", "icon": "⚡", "unlocked": False},
    {"id": 5, "name": "Perfect Score", "desc": "Get all Easy in a session", "icon": "💎", "unlocked": False},
    {"id": 6, "name": "Knowledge Master", "desc": "Reach 90% on any topic", "icon": "🏆", "unlocked": False},
]

PROFILE = {
    "name": "Mohammed",
    "role": "BCA Student · Lifelong Learner",
    "xp": 2450,
    "xpMax": 3000,
    "level": 7,
    "streak": 12,
    "cards_reviewed": "847",
    "avg_retention": "73%",
    "active_topics": "6",
    "total_hours": "42h",
}

HEATMAP = {
    "JavaScript": {
        "concepts": ["Variables", "Functions", "Closures", "Promises", "Async/Await", "Prototypes", "Classes", "Modules", "DOM", "Events", "Errors", "Regex"],
        "vals": [85, 90, 72, 78, 68, 45, 82, 95, 88, 76, 65, 80],
    },
    "Machine Learning": {
        "concepts": ["Linear Reg", "Neural Nets", "Backprop", "Gradient Desc", "Overfitting", "Cross-val", "CNN", "RNN", "Transformers", "Embeddings", "Loss Fns", "Optimization"],
        "vals": [55, 40, 28, 48, 35, 62, 22, 18, 15, 30, 45, 38],
    },
    "System Design": {
        "concepts": ["Load Balancing", "Caching", "CDN", "DB Sharding", "CAP Theorem", "Microservices", "Msg Queues", "API Gateway", "Rate Limiting", "Consistent Hash", "Replication", "Indexing"],
        "vals": [42, 38, 65, 28, 35, 22, 48, 30, 55, 18, 40, 45],
    },
}

_review_counts: dict[int, dict[str, int]] = {}


def get_topics() -> list[dict]:
    return TOPICS


def get_flashcards() -> list[dict]:
    return FLASHCARDS


def get_achievements() -> list[dict]:
    return ACHIEVEMENTS


def get_profile() -> dict:
    return PROFILE


def get_heatmap() -> dict:
    return HEATMAP


def record_review(card_id: int, rating: str) -> dict:
    if card_id not in _review_counts:
        _review_counts[card_id] = {"again": 0, "hard": 0, "good": 0, "easy": 0}

    if rating in _review_counts[card_id]:
        _review_counts[card_id][rating] += 1
        # Persist to "database" (in-memory dict)
        import json
        try:
            with open("reviews.json", "w") as f:
                json.dump(_review_counts, f)
        except:
            pass

    return _review_counts[card_id]


def get_reviews(card_id: int | None = None) -> dict:
    if card_id is not None:
        return _review_counts.get(card_id, {"again": 0, "hard": 0, "good": 0, "easy": 0})
    return _review_counts
