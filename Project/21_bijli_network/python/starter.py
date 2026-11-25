# Bijli Network · TUMHARA KAAM: kruskal() likho. Phir: python starter.py
from network import DSU, run


def kruskal(gaon, wires):
    """wires = [(gaon1, gaon2, kharcha)]
    Lautao: (chosen, skipped)
      chosen  = jo wire lagaye, saste se mehenge order mein
      skipped = jo wire chhode kyunki dono gaon pehle se jude the
    Steps:
      1. wires ko kharche se sort karo
      2. har wire: agar find(a) != find(b) -> union, chosen mein daalo
                   warna skipped mein
      3. chosen mein (gaon - 1) wire ho gaye? ruk jao
    """
    d = DSU(gaon)
    chosen, skipped = [], []
    # TODO
    return chosen, skipped


if __name__ == "__main__":
    run(kruskal)
