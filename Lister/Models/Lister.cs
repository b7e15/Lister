using System;
using System.Collections;
using System.Collections.Generic;

namespace Lister.Models
{
    public class Lister<T> : IEquatable<Lister<T>>, ISorting<T>, IEnumerable<T>
        where T : IComparable<T>
    {
        T[] items;

        public Lister(IEnumerable<T> items)
        {
            this.items = items.ToArray();
        }

        public bool Equals(Lister<T>? other)
        {
            return other == null ? false : this.items.Equals(other.items);
        }

        public void Sort()
        {
            this.Sort((a, b) => a.CompareTo(b));
        }

        public void Sort(IComparer<T>? comparer)
        {
            if (comparer == null)
            {
                this.Sort();
                return;
            }
            this.Sort(comparer.Compare);
        }

        public void Sort(Comparison<T> comparison)
        {
            // Алгоритм вставками
            for (var i = 1; i < this.items.Length; ++i)
            {
                var current = this.items[i];
                var j = i;
                while (j > 0 && comparison(current, this.items[j - 1]) < 0)
                {
                    this.items[j] = this.items[j - 1];
                    j--;
                }
                this.items[j] = current;
            }
        }

        public void Reverse()
        {
            for (var i = 0; i < this.items.Length / 2; ++i)
            {
                var tmp = this.items[i];
                this.items[i] = this.items[this.items.Length - i - 1];
                this.items[this.items.Length - i - 1] = tmp;
            }
        }

        public IEnumerator<T> GetEnumerator()
        {
            return this.items.Cast<T>().GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.items.GetEnumerator();
        }
    }
}
