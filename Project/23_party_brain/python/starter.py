"""Party Brain - YOUR part. Run: python starter.py"""
from party import run


def neuron(inputs, weights, bias):
    """
    Ek neuron = weighted vote.
    1. score = har input * uska weight, sab jodo, phir + bias
    2. score zero se UPAR (> 0) -> return 1, warna return 0
    """
    # TODO: ~3 lines
    return 0


def party_net(rahul, priya):
    """
    3 neurons, 2 layers. Sirf neuron() use karo.
      A     = "koi bhi aaya?"   (OR)   -> inputs [rahul, priya]
      B     = "dono aaye?"      (AND)  -> inputs [rahul, priya]
      final = "A haan, B nahi"         -> inputs [A, B]
    Hint: weights [1, 1] dono ke liye; fark sirf bias ka hai. Final ke liye B ka weight negative.
    """
    # TODO: ~4 lines
    return 0


if __name__ == "__main__":
    run(neuron, party_net)
