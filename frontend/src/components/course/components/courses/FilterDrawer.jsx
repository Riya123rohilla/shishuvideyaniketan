import { useEffect, useRef } from 'react';
import { filterOptions } from '../../data/courses';
import './FilterDrawer.css';

const FilterDrawer = ({ isOpen, onClose, filters, onFilterChange, onReset, onApply }) => {
    const drawerRef = useRef(null);
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleCheckboxChange = (filterType, value) => {
        const currentValues = filters[filterType] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        onFilterChange(filterType, newValues);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        Object.values(filters).forEach(values => {
            if (Array.isArray(values)) {
                count += values.length;
            }
        });
        return count;
    };

    const activeCount = getActiveFiltersCount();

    if (!isOpen) return null;

    return (
        <div className="filter-drawer" ref={drawerRef}>
            <div
                className="drawer-overlay"
                ref={overlayRef}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className="drawer-content" ref={contentRef} role="dialog" aria-modal="true" aria-label="Filter courses">
                {/* Header */}
                <div className="drawer-header">
                    <h3 className="drawer-title">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter Courses
                        {activeCount > 0 && (
                            <span className="drawer-count">{activeCount}</span>
                        )}
                    </h3>
                    <button className="drawer-close" onClick={onClose} aria-label="Close filters">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="drawer-body">
                    {/* Grade Filter */}
                    <div className="drawer-section">
                        <h4 className="section-title">Grade / Level</h4>
                        <div className="section-options">
                            {filterOptions.grades.map((grade) => (
                                <label key={grade} className="drawer-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={(filters.grades || []).includes(grade)}
                                        onChange={() => handleCheckboxChange('grades', grade)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-label">{grade}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Mode Filter */}
                    <div className="drawer-section">
                        <h4 className="section-title">Mode</h4>
                        <div className="section-options section-options-row">
                            {filterOptions.modes.map((mode) => (
                                <label key={mode} className="drawer-chip">
                                    <input
                                        type="checkbox"
                                        checked={(filters.modes || []).includes(mode)}
                                        onChange={() => handleCheckboxChange('modes', mode)}
                                    />
                                    <span className="chip-label">{mode}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Duration Filter */}
                    <div className="drawer-section">
                        <h4 className="section-title">Duration</h4>
                        <div className="section-options section-options-row">
                            {filterOptions.durations.map((duration) => (
                                <label key={duration} className="drawer-chip">
                                    <input
                                        type="checkbox"
                                        checked={(filters.durations || []).includes(duration)}
                                        onChange={() => handleCheckboxChange('durations', duration)}
                                    />
                                    <span className="chip-label">{duration}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Fee Range Filter */}
                    <div className="drawer-section">
                        <h4 className="section-title">Fee Range</h4>
                        <div className="section-options">
                            {filterOptions.feeRanges.map((range) => (
                                <label key={range.label} className="drawer-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={(filters.fees || []).includes(range.label)}
                                        onChange={() => handleCheckboxChange('fees', range.label)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-label">{range.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="drawer-footer">
                    <button className="btn btn-secondary" onClick={onReset}>
                        Reset All
                    </button>
                    <button className="btn btn-primary" onClick={() => { onApply(); onClose(); }}>
                        Apply Filters
                        {activeCount > 0 && ` (${activeCount})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterDrawer;
