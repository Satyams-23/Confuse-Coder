"""Party Brain - solution. Run: python solution.py"""
from party import run


def neuron(inputs, weights, bias):
    score = sum(x * w for x, w in zip(inputs, weights)) + bias
    return 1 if score > 0 else 0


def party_net(rahul, priya):
    a = neuron([rahul, priya], [1, 1], -0.5)   # koi bhi aaya?
    b = neuron([rahul, priya], [1, 1], -1.5)   # dono aaye?
    return neuron([a, b], [1, -1], -0.5)       # A haan, B nahi


if __name__ == "__main__":
    run(neuron, party_net)
