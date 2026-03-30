import Typography from "@mui/material/Typography";
import { useSearchPRsQuery } from "../src/queries/SearchPRs";
import { IPullRequestReviewDecision, IStatusState } from "../src/types/graphqlTypes";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Link,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
  Autocomplete,
  TextField,
  Checkbox,
  Badge
} from "@mui/material";
import { useMemo, useState, useCallback } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, getGridSingleSelectOperators, Toolbar, GridSlotProps, GridFilterModel } from "@mui/x-data-grid";
import { formatDistanceToNow, format } from "date-fns";
import { Icon } from "../src/components/Icon";
import { faCheck, faCircleNotch, faTimes, faArrowsRotate } from "@awesome.me/kit-2cb31446e2/icons/classic/solid";
import { faCodePullRequest, faEyeSlash, faEye } from "@awesome.me/kit-2cb31446e2/icons/classic/regular";
import { useThemeToggle } from "../src/context";
import { useHiddenPRs } from "../src/hooks/useHiddenPRs";
import { useAdaptivePolling } from "../src/hooks/useAdaptivePolling";

const repos = ["rogers", "transfix", "wilson", "broker-platform-svc", "transfix-libraries"] as const;

interface PRLabel {
  id: string;
  name: string;
  color: string;
}

interface PRRow {
  id: string;
  number: number;
  title: string;
  repo: string;
  authorLogin: string;
  authorAvatar: string;
  authorType: string;
  reviewDecision: IPullRequestReviewDecision | null;
  isDraft: boolean;
  statusLabel: string;
  checksState: IStatusState | null;
  checksLabel: string;
  unresolvedCount: number;
  createdAt: string;
  updatedAt: string | null;
  url: string;
  isHidden: boolean;
  labels: PRLabel[];
  readyForReview: boolean;
}

const STATUS_OPTIONS = ["Draft", "Approved", "Review required", "Changes requested", "—"];
const CHECKS_OPTIONS = ["Success", "Failure", "Pending", "—"];

// Calculate contrasting text color (black or white) based on background color
const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

const getReviewDecisionLabel = (decision: IPullRequestReviewDecision | null, isDraft: boolean): string => {
  if (isDraft) return "Draft";
  if (decision === IPullRequestReviewDecision.APPROVED) return "Approved";
  if (decision === IPullRequestReviewDecision.REVIEW_REQUIRED) return "Review required";
  if (decision === IPullRequestReviewDecision.CHANGES_REQUESTED) return "Changes requested";
  return "—";
};

const getReviewDecisionColor = (
  decision: IPullRequestReviewDecision | null,
  isDraft: boolean
): "default" | "secondary" | "success" | "warning" | "error" => {
  if (isDraft) return "secondary";
  if (decision === IPullRequestReviewDecision.APPROVED) return "success";
  if (decision === IPullRequestReviewDecision.REVIEW_REQUIRED) return "warning";
  if (decision === IPullRequestReviewDecision.CHANGES_REQUESTED) return "error";
  return "default";
};

const getColumns = (hidePR: (id: string) => void, unhidePR: (id: string) => void): GridColDef<PRRow>[] => [
  {
    field: "number",
    headerName: "#",
    width: 80,
    renderCell: (params: GridRenderCellParams<PRRow>) => (
      <Link
        href={params.row.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" }
        }}
      >
        <Icon icon={faCodePullRequest} size={14} color="success" />
        {params.value}
      </Link>
    )
  },
  {
    field: "repo",
    headerName: "Repo",
    width: 120,
    type: "singleSelect",
    valueOptions: [...repos],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === "is" || operator.value === "isAnyOf"),
    renderCell: (params: GridRenderCellParams<PRRow>) => (
      <Chip label={params.value} size="small" variant="outlined" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }} />
    )
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    minWidth: 280,
    renderCell: (params: GridRenderCellParams<PRRow>) => {
      const title = params.value as string;
      const match = title.match(/^([A-Z][A-Z0-9]*-\d+)(\s*-?\s*)(.*)$/);
      const labels = params.row.labels || [];

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", opacity: params.row.isHidden ? 0.5 : 1 }}>
          <Link
            href={params.row.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              minWidth: 0
            }}
          >
            {match ? (
              <>
                <Typography component="span" fontWeight="bold" fontSize="inherit">
                  {match[1]}
                </Typography>
                {match[2]}
                {match[3]}
              </>
            ) : (
              title
            )}
          </Link>
          {labels.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
              {labels.map((label) => (
                <Chip
                  key={label.id}
                  label={label.name}
                  size="small"
                  sx={{
                    backgroundColor: `#${label.color}`,
                    color: getContrastColor(label.color),
                    height: 20,
                    fontSize: "0.7rem",
                    "& .MuiChip-label": { px: 1 }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      );
    }
  },
  {
    field: "authorLogin",
    headerName: "Author",
    width: 160,
    renderCell: (params: GridRenderCellParams<PRRow>) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, opacity: params.row.isHidden ? 0.5 : 1 }}>
        <Avatar src={params.row.authorAvatar} sx={{ width: 24, height: 24 }} />
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      </Box>
    )
  },
  {
    field: "statusLabel",
    headerName: "Status",
    width: 150,
    type: "singleSelect",
    valueOptions: STATUS_OPTIONS,
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === "is" || operator.value === "isAnyOf"),
    renderCell: (params: GridRenderCellParams<PRRow>) => {
      const label = params.value as string;
      const color = getReviewDecisionColor(params.row.reviewDecision, params.row.isDraft);
      const unresolvedCount = params.row.unresolvedCount;
      const statusChip =
        label !== "—" ? (
          <Chip label={label} color={color} size="small" sx={{ opacity: params.row.isHidden ? 0.5 : 1 }} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        );
      if (unresolvedCount > 0 && label !== "—") {
        return (
          <Tooltip title={`${unresolvedCount} unresolved review comment${unresolvedCount === 1 ? "" : "s"} — must resolve before merge`}>
            <Badge badgeContent={unresolvedCount} color="primary">
              {statusChip}
            </Badge>
          </Tooltip>
        );
      }
      return statusChip;
    }
  },
  {
    field: "checksLabel",
    headerName: "Checks",
    width: 90,
    align: "center",
    headerAlign: "center",
    type: "singleSelect",
    valueOptions: CHECKS_OPTIONS,
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === "is" || operator.value === "isAnyOf"),
    renderCell: (params: GridRenderCellParams<PRRow>) => {
      const state = params.row.checksState;
      if (state === IStatusState.SUCCESS) return <Icon icon={faCheck} color="success" size={16} />;
      if (state === IStatusState.FAILURE) return <Icon icon={faTimes} color="error" size={16} />;
      if (state === IStatusState.PENDING) return <Icon icon={faCircleNotch} color="warning" size={16} spin />;
      return (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      );
    }
  },
  {
    field: "createdAt",
    headerName: "Created",
    width: 130,
    valueGetter: (value: string) => new Date(value),
    renderCell: (params: GridRenderCellParams<PRRow>) => (
      <Typography variant="body2" title={format(new Date(params.row.createdAt), "PPpp")} sx={{ opacity: params.row.isHidden ? 0.5 : 1 }}>
        {formatDistanceToNow(new Date(params.row.createdAt), { addSuffix: true })}
      </Typography>
    )
  },
  {
    field: "updatedAt",
    headerName: "Updated",
    width: 130,
    valueGetter: (value: string | null) => (value ? new Date(value) : null),
    renderCell: (params: GridRenderCellParams<PRRow>) => {
      const date = params.row.updatedAt;
      if (!date)
        return (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        );
      return (
        <Typography variant="body2" title={format(new Date(date), "PPpp")} sx={{ opacity: params.row.isHidden ? 0.5 : 1 }}>
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </Typography>
      );
    }
  },
  {
    field: "actions",
    headerName: "",
    width: 60,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<PRRow>) => (
      <Tooltip title={params.row.isHidden ? "Unhide PR" : "Hide PR"}>
        <IconButton
          size="small"
          onClick={() => (params.row.isHidden ? unhidePR(params.row.id) : hidePR(params.row.id))}
          color={params.row.isHidden ? "primary" : "default"}
        >
          <Icon icon={params.row.isHidden ? faEye : faEyeSlash} size={16} />
        </IconButton>
      </Tooltip>
    )
  }
];

// Build GitHub search query string for server-side filtering
// Note: GitHub GraphQL search API doesn't support sorting in query string - we sort client-side
function buildSearchQuery(repoFilter: string[], authorFilter: string[], statusFilter: string[], checksFilter: string[]): string {
  const parts: string[] = ["is:pr", "is:open"];

  // Repository filter - if specific repos selected, use repo: qualifier
  // Otherwise, use org: to search all repos in the org
  if (repoFilter.length > 0) {
    repoFilter.forEach((r) => parts.push(`repo:transfixio/${r}`));
  } else {
    parts.push("org:transfixio");
  }

  // Author filter (server-side)
  if (authorFilter.length === 1) {
    parts.push(`author:${authorFilter[0]}`);
  } else if (authorFilter.length > 1) {
    // GitHub search supports multiple author: prefixes
    authorFilter.forEach((a) => parts.push(`author:${a}`));
  }

  // Status filter - map our labels to GitHub search qualifiers
  const statusMappings: Record<string, string> = {
    Approved: "review:approved",
    "Changes requested": "review:changes_requested",
    "Review required": "review:required",
    Draft: "draft:true"
  };

  statusFilter.forEach((status) => {
    const mapping = statusMappings[status];
    if (mapping) parts.push(mapping);
  });

  // Checks filter - map to GitHub status qualifiers
  const checksMappings: Record<string, string> = {
    Success: "status:success",
    Failure: "status:failure",
    Pending: "status:pending"
  };

  checksFilter.forEach((check) => {
    const mapping = checksMappings[check];
    if (mapping) parts.push(mapping);
  });

  return parts.join(" ");
}

interface AuthorOption {
  login: string;
  avatarUrl: string;
}

// Extend the toolbar slot props to include our custom filter props
declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    repoFilter: string[];
    setRepoFilter: (value: string[]) => void;
    statusFilter: string[];
    setStatusFilter: (value: string[]) => void;
    checksFilter: string[];
    setChecksFilter: (value: string[]) => void;
    authorFilter: string[];
    setAuthorFilter: (value: string[]) => void;
    authorOptions: AuthorOption[];
  }
}

function FilterToolbar(props: GridSlotProps["toolbar"]) {
  const { repoFilter, setRepoFilter, statusFilter, setStatusFilter, checksFilter, setChecksFilter, authorFilter, setAuthorFilter, authorOptions } =
    props;

  return (
    <Toolbar>
      <Autocomplete
        multiple
        size="small"
        options={[...repos]}
        value={repoFilter}
        onChange={(_, newValue) => setRepoFilter(newValue)}
        disableCloseOnSelect
        limitTags={2}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {option}
              </Typography>
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label="Repository" placeholder="All" />}
        sx={{ minWidth: 200 }}
      />
      <Autocomplete
        multiple
        size="small"
        options={authorOptions}
        value={authorOptions.filter((a) => authorFilter.includes(a.login))}
        onChange={(_, newValue) => setAuthorFilter(newValue.map((a) => a.login))}
        getOptionLabel={(option) => option.login}
        isOptionEqualToValue={(option, value) => option.login === value.login}
        disableCloseOnSelect
        limitTags={2}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
              <Avatar src={option.avatarUrl} sx={{ width: 20, height: 20, mr: 1 }} />
              <Typography variant="body2">{option.login}</Typography>
            </li>
          );
        }}
        renderValue={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <Chip key={key} avatar={<Avatar src={option.avatarUrl} />} label={option.login} size="small" {...tagProps} />;
          })
        }
        renderInput={(params) => <TextField {...params} label="Author" placeholder="All" />}
        sx={{ minWidth: 200 }}
      />
      <Autocomplete
        multiple
        size="small"
        options={STATUS_OPTIONS.filter((s) => s !== "—")}
        value={statusFilter}
        onChange={(_, newValue) => setStatusFilter(newValue)}
        disableCloseOnSelect
        limitTags={2}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
              {option}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label="Status" placeholder="All" />}
        sx={{ minWidth: 180 }}
      />
      <Autocomplete
        multiple
        size="small"
        options={CHECKS_OPTIONS.filter((s) => s !== "—")}
        value={checksFilter}
        onChange={(_, newValue) => setChecksFilter(newValue)}
        disableCloseOnSelect
        limitTags={2}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
              {option}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label="Checks" placeholder="All" />}
        sx={{ minWidth: 160 }}
      />
      <Box sx={{ flexGrow: 1 }} />
    </Toolbar>
  );
}

export default function PRGrid() {
  const { themeMode } = useThemeToggle();
  const { hiddenPRs, hidePR, unhidePR } = useHiddenPRs();
  const [showHidden, setShowHidden] = useState(false);

  // Adaptive polling hook
  const { pollInterval, triggerRefreshBoost } = useAdaptivePolling({
    activeInterval: 30000, // 30s when active
    idleInterval: 60000, // 60s when idle
    inactiveInterval: 300000, // 5min when tab hidden
    refreshBoostInterval: 15000 // 15s after manual refresh
  });

  // Filter states
  const [repoFilter, setRepoFilter] = useState<string[]>(["rogers", "wilson"]);
  const [authorFilter, setAuthorFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [checksFilter, setChecksFilter] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [showReadyOnly, setShowReadyOnly] = useState(false);

  const columns = useMemo(() => getColumns(hidePR, unhidePR), [hidePR, unhidePR]);

  // Build search query from filters
  const searchQueryString = useMemo(
    () => buildSearchQuery(repoFilter, authorFilter, statusFilter, checksFilter),
    [repoFilter, authorFilter, statusFilter, checksFilter]
  );

  // Single search query with adaptive polling
  const { data, loading, refetch } = useSearchPRsQuery({
    pollInterval,
    variables: {
      query: searchQueryString,
      first: 100
    }
  });

  // Enhanced refetch that triggers refresh boost
  const handleManualRefresh = useCallback(() => {
    triggerRefreshBoost();
    refetch();
  }, [refetch, triggerRefreshBoost]);

  const allRows: PRRow[] = useMemo(() => {
    const rows: PRRow[] = [];
    const nodes = data?.search?.nodes;

    if (!nodes) return rows;

    nodes.forEach((node) => {
      // Only process PullRequest nodes
      if (!node || node.__typename !== "PullRequest") return;

      const pr = node;
      const checksState = pr.statusCheckRollup?.state || null;
      const repoName = pr.repository?.name || "unknown";

      rows.push({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        repo: repoName,
        authorLogin: pr.author?.__typename === "User" ? pr.author.login : pr.author?.__typename === "Bot" ? "bot" : "unknown",
        authorAvatar: pr.author?.__typename === "User" ? pr.author.avatarUrl : "",
        authorType: pr.author?.__typename || "unknown",
        reviewDecision: pr.reviewDecision || null,
        isDraft: pr.isDraft || false,
        statusLabel: getReviewDecisionLabel(pr.reviewDecision || null, pr.isDraft || false),
        checksState,
        checksLabel:
          checksState === IStatusState.SUCCESS
            ? "Success"
            : checksState === IStatusState.FAILURE
              ? "Failure"
              : checksState === IStatusState.PENDING
                ? "Pending"
                : "—",
        unresolvedCount: (pr.reviewThreads?.nodes ?? []).filter((t) => t != null && t.isResolved === false).length,
        createdAt: pr.createdAt,
        updatedAt: pr.commits?.nodes?.[0]?.commit?.committedDate || null,
        url: pr.url,
        isHidden: hiddenPRs.has(pr.id),
        labels: (pr.labels?.nodes || [])
          .filter((l): l is NonNullable<typeof l> => l !== null)
          .map((l) => ({ id: l.id, name: l.name, color: l.color })),
        readyForReview:
          checksState === IStatusState.SUCCESS &&
          !pr.isDraft &&
          pr.reviewDecision === IPullRequestReviewDecision.REVIEW_REQUIRED &&
          (pr.labels?.nodes || []).some((l) => l?.name.toLowerCase() === "ready for claude review")
      });
    });

    // Sort by createdAt descending
    return rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, hiddenPRs]);

  // Only filter hidden rows externally - DataGrid handles the rest via filterModel
  const visibleRows = useMemo(() => {
    let rows = showHidden ? allRows : allRows.filter((row) => !row.isHidden);
    if (showReadyOnly) rows = rows.filter((row) => row.readyForReview);
    return rows;
  }, [allRows, showHidden, showReadyOnly]);

  // Extract unique authors for the filter dropdown
  const authorOptions: AuthorOption[] = useMemo(() => {
    const authorsMap = new Map<string, AuthorOption>();
    allRows.forEach((row) => {
      if (row.authorLogin && row.authorLogin !== "unknown" && row.authorLogin !== "bot") {
        if (!authorsMap.has(row.authorLogin)) {
          authorsMap.set(row.authorLogin, {
            login: row.authorLogin,
            avatarUrl: row.authorAvatar
          });
        }
      }
    });
    return Array.from(authorsMap.values()).sort((a, b) => a.login.localeCompare(b.login));
  }, [allRows]);

  // Build filterModel - only for quick filter since repo/author/status/checks are server-side
  const filterModel: GridFilterModel = useMemo(
    () => ({
      items: [],
      quickFilterValues: searchFilter.trim() ? searchFilter.split(" ").filter(Boolean) : []
    }),
    [searchFilter]
  );

  const hiddenCount = useMemo(() => allRows.filter((row) => row.isHidden).length, [allRows]);
  const readyForReviewCount = useMemo(() => visibleRows.filter((row) => row.readyForReview).length, [visibleRows]);

  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        title="Pull Requests"
        slotProps={{
          title: {
            variant: "h4",
            fontStyle: "italic",
            fontWeight: "regular"
          }
        }}
        action={
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} flexWrap="wrap">
            {readyForReviewCount > 0 && (
              <FormControlLabel
                control={<Switch checked={showReadyOnly} onChange={(e) => setShowReadyOnly(e.target.checked)} size="small" />}
                label={
                  <Chip
                    label={`${readyForReviewCount} ready for review`}
                    color="info"
                    size="small"
                    variant={showReadyOnly ? "filled" : "outlined"}
                  />
                }
              />
            )}
            <Tooltip title={`Refresh (polling every ${Math.round(pollInterval / 1000)}s)`}>
              <IconButton onClick={handleManualRefresh} disabled={loading}>
                <Icon icon={faArrowsRotate} size={16} spin={loading} />
              </IconButton>
            </Tooltip>
            {hiddenCount > 0 && (
              <FormControlLabel
                control={<Switch checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} size="small" />}
                label={`Show ${hiddenCount} hidden`}
              />
            )}
          </Box>
        }
      />
      <CardContent>
        <DataGrid
          rows={visibleRows}
          columns={columns}
          filterModel={filterModel}
          showToolbar={true}
          loading={loading}
          getRowClassName={(params) => (params.row.readyForReview ? "row-ready-for-review" : "")}
          slots={{
            toolbar: FilterToolbar
          }}
          slotProps={{
            toolbar: {
              repoFilter,
              setRepoFilter,
              authorFilter,
              setAuthorFilter,
              authorOptions,
              statusFilter,
              setStatusFilter,
              checksFilter,
              setChecksFilter
            }
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: "updatedAt", sort: "desc" }] }
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            background: "transparent",
            border: "none",
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center"
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "transparent"
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "transparent"
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: themeMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"
            },
            "& .row-ready-for-review": {
              borderLeft: "3px solid",
              borderLeftColor: "info.main",
              backgroundColor: themeMode === "dark" ? "rgba(41, 182, 246, 0.08)" : "rgba(2, 136, 209, 0.06)"
            },
            "& .row-ready-for-review:hover": {
              backgroundColor: themeMode === "dark" ? "rgba(41, 182, 246, 0.14)" : "rgba(2, 136, 209, 0.10)"
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
