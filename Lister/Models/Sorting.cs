using System;
using System.Collections;
using System.Collections.Generic;

namespace Lister.Models
{
    public interface ISorting<T> where T : IComparable<T>
    {
        void Sort();
        void Sort(Comparison<T> comparison);
        void Sort(IComparer<T> comparer);
        void Reverse();
    }
}
