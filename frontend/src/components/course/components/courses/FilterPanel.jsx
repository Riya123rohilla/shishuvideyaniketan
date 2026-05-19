import { useState } from 'react';
import { filterOptions } from '../../data/courses';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
    const [expandedSections, setExpandedSections] = useState({
        grades: true,
        modes: true,
        durations: false,
        fees: false,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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

    return (
        <aside className="filter-panel" aria-label="Course filters">
            <div className="filter-header">
                <h3 className="filter-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {activeCount > 0 && (
                        <span className="filter-count">{activeCount}</span>
                    )}
                </h3>
                {activeCount > 0 && (
                    <button className="filter-reset" onClick={onReset}>
                        Reset all
                    </button>
                )}
            </div>

            <div className="filter-sections">
                {/* Grade Filter */}
                <div className="filter-section">
                    <button
                        className="section-header"
                        onClick={() => toggleSection('grades')}
                        aria-expanded={expandedSections.grades}
                    >
                        <span>Grade / Level</span>
                        <svg
                            className={`chevron ${expandedSections.grades ? 'open' : ''}`}
                            width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {expandedSections.grades && (
                        <div className="section-content">
                            {filterOptions.grades.map((grade) => (
                                <label key={grade} className="filter-checkbox">
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
                    )}
                </div>

                {/* Mode Filter */}
                <div className="filter-section">
                    <button
                        className="section-header"
                        onClick={() => toggleSection('modes')}
                        aria-expanded={expandedSections.modes}
                    >
                        <span>Mode</span>
                        <svg
                            className={`chevron ${expandedSections.modes ? 'open' : ''}`}
                            width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {expandedSections.modes && (
                        <div className="section-content">
                            {filterOptions.modes.map((mode) => (
                                <label key={mode} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={(filters.modes || []).includes(mode)}
                                        onChange={() => handleCheckboxChange('modes', mode)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-label">{mode}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Duration Filter */}
                <div className="filter-section">
                    <button
                        className="section-header"
                        onClick={() => toggleSection('durations')}
                        aria-expanded={expandedSections.durations}
                    >
                        <span>Duration</span>
                        <svg
                            className={`chevron ${expandedSections.durations ? 'open' : ''}`}
                            width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {expandedSections.durations && (
                        <div className="section-content">
                            {filterOptions.durations.map((duration) => (
                                <label key={duration} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={(filters.durations || []).includes(duration)}
                                        onChange={() => handleCheckboxChange('durations', duration)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-label">{duration}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Fee Range Filter */}
                <div className="filter-section">
                    <button
                        className="section-header"
                        onClick={() => toggleSection('fees')}
                        aria-expanded={expandedSections.fees}
                    >
                        <span>Fee Range</span>
                        <svg
                            className={`chevron ${expandedSections.fees ? 'open' : ''}`}
                            width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {expandedSections.fees && (
                        <div className="section-content">
                            {filterOptions.feeRanges.map((range) => (
                                <label key={range.label} className="filter-checkbox">
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
                    )}
                </div>
            </div>
        </aside>
    );
};

export default FilterPanel;
