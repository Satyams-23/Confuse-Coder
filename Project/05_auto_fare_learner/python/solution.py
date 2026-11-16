"""Auto Fare Learner - answer. Run: python solution.py"""
from fare import run


def train_step(w, b, km, fare, lr):
    n = len(km)
    err = [w * k + b - f for k, f in zip(km, fare)]       # guess vs asli
    dw = 2 * sum(e * k for e, k in zip(err, km)) / n       # galti badhti kis taraf? (rate)
    db = 2 * sum(err) / n                                  # (base)
    return w - lr * dw, b - lr * db                        # ulti taraf thoda khiskao


if __name__ == "__main__":
    run(train_step)
