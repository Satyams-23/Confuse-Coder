"""Auto Fare Learner - YOUR part. Run: python starter.py"""
from fare import run


def train_step(w, b, km, fare, lr):
    """
    One "guess -> galti -> adjust" step.
      w = rate per km, b = base fare (the model: pred = w * km + b)
    1. har ride ka prediction aur error (pred - asli fare) nikalo
    2. gradient:  dw = 2 * avg(error * km),   db = 2 * avg(error)
    3. ulti direction mein thoda khiskao:  w -= lr * dw,  b -= lr * db
    return the new (w, b)
    """
    # TODO: ~6 lines
    return w, b


if __name__ == "__main__":
    run(train_step)
